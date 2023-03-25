FROM public.ecr.aws/lambda/nodejs:18

COPY app.mjs /var/task

CMD [ "app.handler" ]
