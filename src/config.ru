require 'rubygems'
require 'bundler'

Bundler.require

$: << '.'
require 'controllers/appmarket-server'

run Sinatra::Application
