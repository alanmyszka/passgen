from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI(
    docs_url="/swagger",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/password-manager/login", response_class=HTMLResponse)
async def password_manager(request: Request):
    return templates.TemplateResponse("pm_login.html", {"request": request})

@app.get("/password-manager/register", response_class=HTMLResponse)
async def password_manager(request: Request):
    return templates.TemplateResponse("pm_register.html", {"request": request})

@app.exception_handler(StarletteHTTPException)
async def custom_404_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return templates.TemplateResponse("404.html", {"request": request}, status_code=404)
    return HTMLResponse(content="An error occurred", status_code=exc.status_code)