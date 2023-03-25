#
# builder
#
FROM public.ecr.aws/lambda/nodejs:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run tsc

#
# prod
#
FROM public.ecr.aws/lambda/nodejs:18 as prod

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist/ /var/task/

CMD [ "index.handler" ]
