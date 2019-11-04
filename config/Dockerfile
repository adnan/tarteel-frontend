FROM ubuntu:bionic

WORKDIR /root

# Prereqs
RUN apt-get update && \
    apt-get install -y git curl lsb-release gnupg gcc g++ make

# Yarn and node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && \
    apt-get install -y nodejs yarn

# Clone and install deps
RUN git clone https://github.com/Tarteel-io/tarteel-frontend.git && \
    cd tarteel-frontend && yarn install

ENV PATH $PATH:/root/tarteel-frontend/node_modules/.bin/

WORKDIR /root/tarteel-frontend
RUN ts-node -T -O '{"module": "commonjs"}' --transpileOnly internal/scripts/build -- --optimize
CMD cross-env DEPLOYMENT=development ts-node -O '{"module": "commonjs"}' --transpileOnly internal/development
