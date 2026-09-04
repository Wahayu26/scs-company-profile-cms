FROM node:22-bookworm-slim AS dependencies

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS builder

# Payload imports its configuration during the build. This value is never used
# by the runtime container, which must receive PAYLOAD_SECRET separately.
ARG PAYLOAD_BUILD_SECRET=build-only-secret-do-not-use-at-runtime
ARG PAYLOAD_SERVER_URL=http://localhost:3101
ARG WEBSITE_URL=http://localhost:3000
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=$PAYLOAD_BUILD_SECRET
ENV PAYLOAD_SERVER_URL=$PAYLOAD_SERVER_URL
ENV WEBSITE_URL=$WEBSITE_URL

COPY . .
RUN pnpm build

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN npm install --global pnpm@10.17.1 \
  && groupadd --system --gid 1001 nextjs \
  && useradd --system --uid 1001 --gid nextjs --create-home nextjs

WORKDIR /app

COPY --from=builder --chown=nextjs:nextjs /app /app

RUN mkdir -p /app/.data /app/public/media \
  && chown -R nextjs:nextjs /app/.data /app/public/media

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["pnpm", "start"]
