{ pkgs, lib, config, inputs, ... }:

{
	services.postgres = {
		enable = true;
		listen_addresses = "127.0.0.1";
	};

	# https://devenv.sh/pre-commit-hooks/
	# pre-commit.hooks.shellcheck.enable = true;
}
