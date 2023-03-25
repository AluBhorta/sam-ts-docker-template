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
npm run build
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

## updates 

after changes to the CFN template do:

```sh
sam build
sam deploy
```

NOTE: if you change the lambda code, then you need to build and push images again before doing the sam build + deploy.

## clean up

delete the sam app
```sh
sam delete
```

delete the ecr repository. WARNING: this will force remove all images in the repo.

```sh
aws ecr delete-repository --force --repository-name $IMG_NAME 
```

## refs

- https://gallery.ecr.aws/lambda/nodejs
