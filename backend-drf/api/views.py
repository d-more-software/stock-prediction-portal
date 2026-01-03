from rest_framework.views import APIView
from rest_framework.response import Response

class StockPlotsAPIView(APIView):
    def get(self, request):
        plots = {
            "plot": "/media/AAPL_plot.png",
            "ma100": "/media/AAPL_100_dma.png",
            "ma200": "/media/AAPL_200_dma.png",
            "prediction": "/media/AAPL_final_prediction.png",
        }
        return Response({"status": "success", "plots": plots})
