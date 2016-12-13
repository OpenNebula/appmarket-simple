#!/usr/bin/env ruby

$: << File.dirname(__FILE__) + "/../lib"

require 'net/http'
require 'uri'
require 'json'
require 'yaml'
require 'tempfile'
require 'fileutils'

require 'appliance'
require 'appliance/image'

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
if (ARGV.size > 0)
    dir = ARGV[0]
    if File.exists?(dir)
        abort "#{dir} already exists"
    end

    appliances_file = ARGV[1]
else
    abort <<EOF
Usage: #{$0} <directory> [<appliances.json>]

Non-existing directory needs to be specified for the structure
of YAML appliance metadata.

A json file containing appliances can be specified instead of using
appmarket API output.
EOF
end

if appliances_file
    begin
        mkt_apps = JSON.parse(File.read(appliances_file))
    rescue => e
        abort "Failed reading appliances file: #{e.message}"
    end
else
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
end

if !mkt_apps.is_a? Array || mkt_apps.empty?
    abort "Missing appliances"
end

###

mkt_apps.each { |mkt_app|
    # core appliance metadata
    id = mkt_app['_id']['$oid']

    app = Appliance.new()
    app.from_h({
        'name'                  => mkt_app['name'],
        'version'               => mkt_app['version'],
        'publisher'             => mkt_app['publisher'],
        'short_description'     => mkt_app['short_description'],
        'description'           => mkt_app['description'],
        'tags'                  => mkt_app['tags'],
        'format'                => mkt_app['format'],
        'creation_time'         => mkt_app['creation_time'],
        'opennebula_template'   => mkt_app['opennebula_template'],
        'opennebula_version'    => mkt_app['opennebula_version'],
        'os_id'                 => mkt_app['os-id'],
        'os_release'            => mkt_app['os-release'],
        'os_arch'               => mkt_app['os-arch'],
        'hypervisor'            => mkt_app['hypervisor'],
        'logo'                  => mkt_app['logo']
    })

    # appliance files
    mkt_app['files'].each_with_index { |mkt_file, mkt_idx|
        image = Appliance::Image.new()
        image.from_h({
            'type'          => mkt_file['type'],
            'dev_prefix'    => mkt_file['dev_prefix'],
            'driver'        => mkt_file['driver'],
            'location'      => nil,
            'size'          => mkt_file['size'].to_i,
        })

        if mkt_file['checksum'].is_a? Hash
            image.checksum = mkt_file['checksum']
        end

        # set MD5
        if mkt_file['md5'] and (image.checksum.nil? or !image.checksum.key?('md5'))
            image.set_checksum('md5', mkt_file['md5'])
        end

        if mkt_file['url']
            image.location = mkt_file['url']
        else
            # get image URL
            uri = URI.parse('%s/%s/download/%i' % [ONE_MARKET_URL, id, mkt_idx])
            req = Net::HTTP::Get.new(uri.request_uri)
            res = http.request(req)
            if (res.is_a? Net::HTTPFound)
                image.location = res['Location']
            else
                abort "Image location not found for %s / %i" % [id, mkt_idx]
            end
        end

        app.images << image
    }

    appliances[id] = app
}

tmp_dir = Dir.mktmpdir(nil, File.dirname(dir))
begin
    appliances.each { |id, app|
        app.write_yaml("#{tmp_dir}/#{id}.yaml")
    }

    unless File.exists?(dir)
        File.rename(tmp_dir, dir)
    else
        abort "#{dir} already exists"
    end
ensure
    if File.directory?(tmp_dir)
        FileUtils.remove_entry(tmp_dir) 
    end
end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
