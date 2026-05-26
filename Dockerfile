FROM node:22-alpine

WORKDIR /app

COPY AGENTS.md ./
COPY scripts ./scripts
COPY lecture-cuts ./lecture-cuts
COPY docs ./docs

ENV HOST=0.0.0.0
ENV PORT=8777

EXPOSE 8777

CMD ["node", "scripts/serve-lecture-cuts-review.js", "--port", "8777"]

