# Environment variables
#  - ONE_IP
#  - VERSION

INSTALL_PATH ?= '/opt'

ifndef REMOTE_USER
REMOTE_USER := 'root'
endif

ifndef MARKET_IP
$(error MARKET_IP is not set)
endif

.PHONY: install

install:
	ansible-playbook -u $(REMOTE_USER) -v site.yml --inventory $(MARKET_IP), -e install_path=$(INSTALL_PATH)
