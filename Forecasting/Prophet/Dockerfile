# FROM python:3.8

# ENV PORT 8080
# ENV HOSTDIR 0.0.0.0

# EXPOSE 8080

# RUN apt-get update -y && \
#     apt-get install -y python3-pip

# COPY ./requirements.txt /app/requirements.txt

# WORKDIR /app

# RUN pip install -r requirements.txt

# COPY . /app


# ENTRYPOINT ["python", "app.py"] 

FROM python:3.7

# RUN apt-get -y update  && apt-get install -y \
#     python3-dev \
#     libpng-dev \
#     apt-utils \
#     python-dev \
#     && rm -rf /var/lib/apt/lists/*

RUN apt-get update -y && \
    apt-get install -y python3-pip && \
    apt-get install g++ gcc

RUN pip install --upgrade setuptools
RUN pip install pystan==2.18
RUN pip install cython
RUN pip install numpy
RUN pip install matplotlib

RUN pip install fbprophet
RUN pip install flask
RUN pip install google-cloud-storage
RUN pip install sklearn
RUN pip install flask-cors

ENV PORT 8081
ENV HOSTDIR 0.0.0.0

EXPOSE 8081


WORKDIR /app
COPY . /app

ENV GOOGLE_APPLICATION_CREDENTIALS=fbprophet-forecast-03ef9f617980.json

CMD [ "python", "app.py" ]