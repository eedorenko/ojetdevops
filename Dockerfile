FROM eugeneflexagon/ojetbuilder
COPY . .
RUN ojet build


FROM nginx:1.10.2-alpine
COPY --from=0 web /usr/share/nginx/html
EXPOSE 80