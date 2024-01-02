# 42evaluators

Welcome to the **42evaluators** GitHub repository!

## Running

We use [devenv](https://devenv.sh) for development. It provides an easy way to
install and setup PostgreSQL (it's probably also possible to setup PostgreSQL
separately. You might have to modify `internal/database/db.go` adequately).

Once you've downloaded it, run `devenv up -d`. This runs PostgreSQL in the background
(you can also remove the `-d` if you want to inspect the logs). Afterwards, you
can enter the development shell with `devenv shell`.

You need to fill `.env`. It contains credentials to connect to your account,
which you can find in the "Storage" tab of the Devtools while you're on the 42 intra,
to create API keys (to prevent rate limiting, because 42evaluators requires
doing a LOT of API requests). See `.env.example`.

Finally, you can use the Makefile to launch 42evaluators: `make`

This will generate API keys, and start fetching a bunch of stuff (such as
projects, which takes a lot of time...). You can open up `localhost:8080`.

## Backstory

A few months ago, some students from 42 Le Havre noticed 42evaluators.com went down.
We decided to email the previous owner, @rfautier, to try to keep maintaining
the code ourselves.

After he agreed, we checked the code, but many parts of it would have needed to
be replaced if we wanted to keep the code clean.

Since I liked Go, I decided to rewrite it completly in Go. But the other students
didn't like that language, so I ended up rewriting most of it myself.
