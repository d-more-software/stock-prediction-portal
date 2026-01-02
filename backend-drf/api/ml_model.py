from keras.models import load_model

_model = None

def get_model():
    global _model
    if _model is None:
        _model = load_model("stock_prediction_model.keras")
    return _model
