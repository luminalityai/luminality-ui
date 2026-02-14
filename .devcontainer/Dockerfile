ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-bookworm-slim

# Install system dependencies and GitHub CLI
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    ca-certificates \
    curl \
    gpg \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get -y install --no-install-recommends gh \
    && rm -rf /var/lib/apt/lists/*

# Rename existing node user (uid 1000) to vscode for devcontainer compatibility
RUN usermod -l vscode -d /home/vscode -m node \
    && groupmod -n vscode node

USER vscode
