package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
)

func GetPageCount(headers *http.Header, delim string, requestError error) (int, error) {
	var syntaxErrorCheck *json.SyntaxError
	if requestError != nil && !errors.As(requestError, &syntaxErrorCheck) {
		// we don't care about JSON parsing errors,
		// since HEAD requests aren't supposed to have
		// content
		return 0, requestError
	}
	if headers == nil {
		return 0, errors.New("response did not contain any headers")
	}
	_, after, _ := strings.Cut(headers.Get("link"), "page=")
	pageCountRaw, _, _ := strings.Cut(after, delim)
	pageCount, err := strconv.Atoi(pageCountRaw)
	if err != nil {
		return 0, errors.New("did not find last page number in Link header")
	}
	return pageCount, nil
}
