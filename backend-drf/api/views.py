from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.http import JsonResponse
import os

class StockPlotsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        plots = {}
        
        media_files = {
            "plot": "/media/AAPL_plot.png",
            "ma100": "/media/AAPL_100_dma.png",
            "ma200": "/media/AAPL_200_dma.png",
            "prediction": "/media/AAPL_final_prediction.png",
        }

        for key, filename in media_files.items():
            file_path = os.path.join(settings.MEDIA_ROOT, filename)
            if os.path.exists(file_path):
                # Crée une URL complète pour le frontend
                plots[key] = request.build_absolute_uri(settings.MEDIA_URL + filename)

        return JsonResponse({"plots": plots})


