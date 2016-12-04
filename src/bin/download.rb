#!/usr/bin/env ruby

require 'net/http'
require 'uri'
require 'json'
require 'yaml'
require 'tempfile'
require 'fileutils'

def down_keys(h)
    new = {}
    h.each { |key, value|
        kn = key.to_s.downcase
        if value.is_a? Hash
            new[kn] = down_keys(value)
        else
            new[kn] = value
        end
    }
    new
end

######

ONE_MARKET_URL = 'http://marketplace.opennebula.systems/appliance'

appliances = Hash.new()

# expect destination dir. as argument
if (ARGV.size == 1)
    dir = ARGV[0]
else
    abort <<EOF
Usage: #{$0} <directory>

Non-existing directory needs to be specified for the structure
of YAML appliance metadata.
EOF
end

# fetch current appliances
uri = URI.parse(ONE_MARKET_URL)
http = Net::HTTP.new(uri.host, uri.port)
req = Net::HTTP::Get.new(uri.request_uri)
res = http.request(req)

unless res.is_a? Net::HTTPSuccess
    abort "Error downloading appliances list"
end

begin
    mkt_apps = JSON.parse(res.body)['appliances']
rescue JSON::ParserError
    abort "Failed to parse JSON"
end

if !mkt_apps.is_a? Array || mkt_apps.empty?
    abort "Missing appliances"
end

###

mkt_apps.each { |mkt_app|
    # core appliance metadata
    id = mkt_app['_id']['$oid']

    one_tmpl = mkt_app['opennebula_template']
    unless one_tmpl.nil?
        one_tmpl = down_keys(JSON.parse(one_tmpl))
    end

    app = {
        'name'                  => mkt_app['name'],
        'version'               => mkt_app['version'],
        'publisher'             => mkt_app['publisher'],
        'description'           => mkt_app['short_description'],
        'tags'                  => mkt_app['tags'].collect(&:strip),
        'format'                => mkt_app['format'],
        'creation_time'         => mkt_app['creation_time'],
        'opennebula_template'   => one_tmpl,
        'files'                 => [],
    }

    app.delete_if { |k, v| v.nil? }

    # appliance files
    mkt_app['files'].each_with_index { |mkt_file, mkt_idx|
        file = {
            'type'          => mkt_file['type'],
            'dev_prefix'    => mkt_file['dev_prefix'],
            'driver'        => mkt_file['driver'],
            'location'      => nil,
            'size'          => mkt_file['size'].to_i,
        }

        if mkt_file['checksum'].is_a? Hash
            file['checksum'] = mkt_file['checksum']
        else
            file['checksum'] = {}
        end

        # set MD5
        if !file['checksum'].key?('md5') and mkt_file['md5']
            file['checksum']['md5'] = mkt_file['md5']
        end

        # get image URL
        uri = URI.parse('%s/%s/download/%i' % [ONE_MARKET_URL, id, mkt_idx])
        req = Net::HTTP::Get.new(uri.request_uri)
        res = http.request(req)
        if (res.is_a? Net::HTTPFound)
            file['location'] = res['Location']
        else
            abort "Image location not found for %s / %i" % [id, mkt_idx]
        end

        file.delete_if { |k, v| v.nil? }
        app['files'] << file
    }

    appliances[id] = app
}

### 

tmp_dir = Dir.mktmpdir
begin
    appliances.each { |id, appliance|
        File.open('%s/%s.yaml' % [tmp_dir, id], 'w') { |file|
            file.write(appliance.to_yaml(:line_width => 70))
        }
    }

    unless File.exists?(dir)
        FileUtils.mv(tmp_dir, dir)
    else
        abort "#{dir} already exists"
    end
ensure
    if File.directory?(tmp_dir)
        FileUtils.remove_entry(tmp_dir) 
    end
end
