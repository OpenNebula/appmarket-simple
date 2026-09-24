# Environment variables
#  - ONE_IP
#  - VERSION
#  - WEB_EXCLUDE: regexp of appliance files hidden from the web listing
#                 (APPLIANCES_WEB_EXCLUDE), e.g. '/v6/' on the main marketplace

INSTALL_PATH ?= '/opt'

ifndef REMOTE_USER
REMOTE_USER := 'root'
endif

ifndef MARKET_IP
$(error MARKET_IP is not set)
endif

.PHONY: install

install:
	ansible-playbook -u $(REMOTE_USER) -v site.yml --inventory $(MARKET_IP), -e install_path=$(INSTALL_PATH) $(if $(WEB_EXCLUDE),-e appliances_web_exclude='$(WEB_EXCLUDE)')
