package api

import (
	"os"
	"fmt"
	"net/http"
	"net/http/httputil"
)

const DEBUG_VAR = "httpdebug"

func debugRequest(req *http.Request) {
	if os.Getenv(DEBUG_VAR) != "" {
		output, err := httputil.DumpRequestOut(req, true)
		if err == nil {
			fmt.Printf("\n\n%s\n\n", output)
		} else {
			fmt.Fprintf(os.Stderr, "request errored out: %s\n", err)
		}
	}
}

func debugResponse(res *http.Response) {
	if os.Getenv(DEBUG_VAR) != "" {
		output, err := httputil.DumpResponse(res, true)
		if err == nil {
			fmt.Printf("\n\n%s\n\n", output)
		} else {
			fmt.Fprintf(os.Stderr, "request errored out: %s\n", err)
		}
	}
}
