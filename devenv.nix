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

	env.PRODUCTION = "n"; # this is not a real environment variable,
						  # you need to modify it here to take effect
	processes.evaluators = lib.mkIf (config.env.PRODUCTION == "y") {
		exec = "make prod";
	};

	pre-commit.hooks.golangci-lint.enable = true;

	# .env is not used in this file
	dotenv.disableHint = true;
}
