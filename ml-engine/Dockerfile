FROM python:3.10-slim

WORKDIR /app

# install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

#Install poetry
RUN pip install poetry


# copy dependency files
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi


# copy source
COPY . .

EXPOSE 8000

CMD ["uvicorn","main:app", "--host", "0.0.0.0","--port", "8000"]
