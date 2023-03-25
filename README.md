# sam-docker-node-lambda

build and deploy serverless docker node lambdas using aws sam cli.

## prerequisites

- aws cli
- sam cli

## getting started

### initialize

set env vars. NOTE: make sure to update `AWS_ACCOUNT_ID` with your actual account ID.

```sh
export LAMBDA_FUNC_NAME=my-node-lambda
export IMG_NAME=my-node-lambda
export IMG_TAG=latest
export AWS_ACCOUNT_ID=1234567890
export AWS_REGION=ap-south-1
```

build image

```sh
docker build -t $IMG_NAME:$IMG_TAG .
```

create and login to ecr repo

```sh
aws ecr create-repository --repository-name $IMG_NAME

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

tag and push image

```sh
docker tag $IMG_NAME:$IMG_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMG_NAME:$IMG_TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMG_NAME:$IMG_TAG
```

NOTE: only run the following command if you're on an `x86_64` system ie. if you've NOT used an `arm64` system to build your docker image.

```sh
sed -i '' -e 's|Default: arm64|Default: x86_64|' template.yaml
```

build and deploy the serverless resources with sam.

```sh
sam build
sam deploy
```

after `sam deploy` completes, it will output the API endpoint, something like `https://13iu4jrnew.execute-api.ap-south-1.amazonaws.com/Prod/hello`. copy and set it as an env var:

```sh
export API_ENDPOINT=https://13iu4jrnew.execute-api.ap-south-1.amazonaws.com/Prod/hello
```

the API supports both GET and POST methods - test it out:

```sh
# GET
curl $API_ENDPOINT

# POST
curl -X POST -H 'Content-type: application/json' -d '{"name":"Jon Doe"}' $API_ENDPOINT
```

### updates 

after changes to the code do:

```sh
# update the IMG_TAG
export IMG_TAG=v2

# build and push the new image
docker build -t $IMG_NAME:$IMG_TAG .
docker tag $IMG_NAME:$IMG_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMG_NAME:$IMG_TAG
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMG_NAME:$IMG_TAG

# build and deploy/update the sam app
sam build
sam deploy --parameter-overrides ParameterKey=ImageTag,ParameterValue=$IMG_TAG
```

### clean up

delete the sam app
```sh
sam delete
```

delete the ecr repository. WARNING: this will force remove all images in the repo.

```sh
aws ecr delete-repository --force --repository-name $IMG_NAME 
```

### testing locally

run the built image mapped to local port 9000:
```sh
docker run --rm -p 9000:8080 $IMAGE_NAME:$IMG_TAG
```

on a separate terminal, invoke the function:
```sh
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"body":"{\"name\":\"Jon Doe\"}"}' \
  "http://localhost:9000/2015-03-31/functions/function/invocations"
```

## refs

- https://gallery.ecr.aws/lambda/nodejs
