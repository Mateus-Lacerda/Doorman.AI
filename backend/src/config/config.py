class DBConfig:
    def __init__(self) -> None:
        self.host = "localhost"
        self.port = 3306
        self.user = "root"
        self.password = "password"
        self.database = "test_db"


class Config:
    def __init__(self) -> None:
        self.db = DBConfig()
        self.debug = True



def get_config() -> Config:
    """
    Get the configuration object.
    """
    return Config()
