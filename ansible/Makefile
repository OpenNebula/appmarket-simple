# Environment variables
#  - ONE_IP
#  - VERSION

ifndef INSTALL_PATH
INSTALL_PATH := '/opt'
endif

ifndef REMOTE_USER
REMOTE_USER := 'root'
endif

ifndef MARKET_IP
$(error MARKET_IP is not set)
endif

.PHONY: install

install:
	ansible-playbook -u $(REMOTE_USER) -v site.yml --inventory $(MARKET_IP), -e install_path=$(INSTALL_PATH)
