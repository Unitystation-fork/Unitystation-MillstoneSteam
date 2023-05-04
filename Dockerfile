FROM node:19-alpine3.16

# Create app directory
RUN mkdir -p /app
WORKDIR /app

#Install app dependencies
RUN apk update && apk upgrade 
    
#Set environment variables


# Bundle app source
COPY . /app
RUN npm install




#congig prisma
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma migrate status

# Build app
RUN npm run build

#Set prisma folder
RUN mkdir  /app/.output/server/prisma
RUN cp /app/prisma/milestone.db /app/.output/server/prisma/milestone.db

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expose port
EXPOSE 3000 5555

#start app
CMD [ "npm", "run", "start" ]