{ pkgs, lib, config, inputs, ... }:

{
	languages.go.enable = true;

	services.postgres = {
		enable = true;
		listen_addresses = "127.0.0.1";
	};

	enterShell = ''
		export PATH="${GOPATH:-$HOME/go}/bin:$PATH"
	'';

	pre-commit.hooks.golangci-lint.enable = true;

	# .env is not used in this file
	dotenv.disableHint = true;
}
