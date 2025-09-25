# ai-chatbot/inspect_db.py
import os, pymysql
from dotenv import load_dotenv
load_dotenv()

conn = pymysql.connect(
    host=os.getenv("MYSQL_HOST"),
    port=int(os.getenv("MYSQL_PORT", "3306")),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DB"),
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)
with conn, conn.cursor() as cur:
    cur.execute("SHOW TABLES;")
    tables = [list(r.values())[0] for r in cur.fetchall()]
    print("Tables:", tables)
    for t in tables:
        cur.execute(f"SHOW COLUMNS FROM `{t}`;")
        cols = [r["Field"] + " (" + r["Type"] + ")" for r in cur.fetchall()]
        print(f"- {t}: {', '.join(cols)}")
