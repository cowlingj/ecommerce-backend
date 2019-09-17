FROM fusionauth/fusionauth-search:1.7.4
LABEL version="0.0.1"

USER root

# Fix: file permissions https://github.com/FusionAuth/fusionauth-issues/issues/191
RUN chown -R fusionauth:fusionauth /usr/local/fusionauth/

USER fusionauth
