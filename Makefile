TEMPL ?= templ
GO ?= go

default: dev

TEMPLATES = $(patsubst %.templ,%_templ.go,$(wildcard web/templates/*.templ))

web/templates/%_templ.go: web/templates/%.templ
	$(TEMPL) generate -f $^

templates: $(TEMPLATES)

dev: deps templates
	env $(FLAGS) $(GO) run $(GOFLAGS) cmd/*.go

prod: GOFLAGS="-ldflags=-X github.com/demostanis/42evaluators/internal/api.defaultRedirectURI=https://42evaluators.com"
prod: deps templates dev

nojobs: FLAGS=disabledjobs=*
nojobs: dev

race: GOFLAGS+=-race
race: dev

debug: FLAGS=httpdebug=*
debug: dev

42evaluators: templates
	$(GO) build cmd/main.go -o $@

build: deps 42evaluators

clean:
	$(RM) $(TEMPLATES)

deps:
	@if ! which templ >/dev/null 2>&1 ; then \
		$(GO) install github.com/a-h/templ/cmd/templ@latest; \
	fi

.PHONY: default templates dev build clean deps
