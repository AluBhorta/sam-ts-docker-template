# docker image based lambdas

## getting started

```sh
export LAMBDA_FUNC_NAME=my-node-lambda
export IMAGE_NAME=my-node-lambda
export IMG_TAG=latest
```

### local/dev

build
```sh
docker build -t $IMAGE_NAME:$IMG_TAG .
```

run
```sh
docker run -p 9000:8080 $IMAGE_NAME:$IMG_TAG
```

test
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

create lambda function using the aws web console and specify the image.

update lambda function
```sh
aws lambda update-function-code \
  --function-name $LAMBDA_FUNC_NAME \
  --image-uri 900142166256.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:$IMG_TAG
```

## refs

- https://gallery.ecr.aws/lambda/nodejs
