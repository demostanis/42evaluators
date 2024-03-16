TEMPL ?= templ
GO ?= go

default: dev

TEMPLATES = $(patsubst %.templ,%_templ.go,$(wildcard web/templates/*.templ))

web/templates/%_templ.go: web/templates/%.templ
	$(TEMPL) generate -f $^

templates: $(TEMPLATES)

dev: deps templates
	$(GO) run -race cmd/main.go

42evaluators: templates
	$(GO) build cmd/main.go -o $@

build: 42evaluators

clean:
	$(RM) $(TEMPLATES)

deps:
	@if ! which templ >/dev/null 2>&1 ; then \
		$(GO) install github.com/a-h/templ/cmd/templ@latest; \
	fi

.PHONY: default templates dev build clean deps
