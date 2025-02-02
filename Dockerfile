FROM oven/bun AS build

WORKDIR /

# Cache packages installation
COPY package.json package.json
COPY bun.lockb bun.lockb

RUN bun install

COPY ./ ./

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /

COPY --from=build /server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 8000