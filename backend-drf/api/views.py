from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import StockPredictionSerializer
import yfinance as yf
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from .ml_model import get_model
from .utils import save_plot

class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ticker = serializer.validated_data['ticker']

        # 🔹 Téléchargement des données : 1 an seulement
        now = datetime.now()
        start = datetime(now.year-1, now.month, now.day)
        df = yf.download(ticker, start=start, end=now, auto_adjust=True)
        df.columns = df.columns.get_level_values(0)
        if df.empty:
            return Response({'error': 'No data found for this ticker.'},
                            status=status.HTTP_404_NOT_FOUND)
        df = df.reset_index()

        # 🔹 Préparation du dataset
        data_training = pd.DataFrame(df['Close'][:int(len(df)*0.7)])
        data_testing = pd.DataFrame(df['Close'][int(len(df)*0.7):])

        scaler = MinMaxScaler(feature_range=(0,1))
        past_100_days = data_training.tail(100)
        final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
        input_data = scaler.fit_transform(final_df)

        x_test, y_test = [], []
        for i in range(100, input_data.shape[0]):
            x_test.append(input_data[i-100:i])
            y_test.append(input_data[i, 0])
        x_test, y_test = np.array(x_test), np.array(y_test)

        # 🔹 Lazy-load du modèle Keras
        model = get_model()
        y_predicted = model.predict(x_test)

        # 🔹 Revert scaling
        y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
        y_test = scaler.inverse_transform(np.array(y_test).reshape(-1,1)).flatten()

        # 🔹 Plot final
        plt.switch_backend('AGG')
        plt.figure(figsize=(12,5))
        plt.plot(y_test, label='Original price')
        plt.plot(y_predicted, label='Predicted price')
        plt.title(f'Prediction for {ticker}')
        plt.xlabel('Days')
        plt.ylabel('Close price')
        plt.legend()
        plot_path = f'{ticker}_prediction.png'
        plot_url = save_plot(plot_path)  # save_plot doit renvoyer l'URL si possible

        # 🔹 Metrics
        mse = mean_squared_error(y_test, y_predicted)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_predicted)

        return Response({
            'status': 'success',
            'plot': plot_url,
            'mse': mse,
            'rmse': rmse,
            'r2': r2
        })
