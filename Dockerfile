FROM public.ecr.aws/lambda/nodejs:18

COPY dist/ /var/task/

CMD [ "index.handler" ]
