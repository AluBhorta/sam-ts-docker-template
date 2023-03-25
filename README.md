# docker image based lambdas

## getting started

```sh
export IMG_TAG=latest
export IMAGE_NAME=my-node-lambda
```

### local/dev

```sh
docker build -t $IMAGE_NAME:$IMG_TAG .
docker run -p 9000:8080 $IMAGE_NAME
```

```sh
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'
```

### prod

ecr registry creation & login
```sh
aws ecr create-repository --repository-name $IMAGE_NAME

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 900142166256.dkr.ecr.ap-south-1.amazonaws.com
```

build and push image

```sh
docker build -t $IMAGE_NAME:$IMG_TAG .
docker tag $IMAGE_NAME:$IMG_TAG 900142166256.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:$IMG_TAG
docker push 900142166256.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:$IMG_TAG
```

## refs

- https://gallery.ecr.aws/lambda/nodejs
