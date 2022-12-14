FROM python:alpine
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 5000/tcp
EXPOSE 5000/udp
CMD ["python3", "run.py"]