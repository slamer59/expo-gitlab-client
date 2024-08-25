import logging
from functools import wraps

# Set up logging
logger = logging.getLogger(__name__)


def log_function(before_message="", after_message=""):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"{func.__name__}: {before_message}")
            result = func(*args, **kwargs)
            logger.info(f"{after_message}")
            return result

        return wrapper

    return decorator
