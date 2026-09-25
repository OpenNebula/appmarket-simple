require 'appliance'

APPLIANCES_FILTER = ENV['APPLIANCES_FILTER'] || '/appliances/**/*.yaml'

# Regular expression matched against the appliance file path (relative to the
# data directory). Matching appliances are still served to OpenNebula
# front-ends asking for their version, but are left out of the unfiltered
# listing shown to web browsers and other clients. Used to hide entries kept
# only for old OpenNebula versions (e.g. '/v6/') which duplicate current ones.
APPLIANCES_WEB_EXCLUDE = ENV['APPLIANCES_WEB_EXCLUDE'].to_s.empty? ? nil :
                         Regexp.new(ENV['APPLIANCES_WEB_EXCLUDE'])

class Appliances

    def initialize(dir, base_url)
        @dir        = dir
        @base_url   = base_url
        @appliances = nil
        @web        = nil
        @cache      = {}

        reload
    end

    def reload
        if File.directory?(@dir)
            ptrn = @dir + APPLIANCES_FILTER
#        elsif File.file?(@dir)
#            ptrn = @dir
        else
            raise "Invalid source #{@dir}"
        end

        new    = {}
        web    = {}
        @cache = {}

        Dir.glob(ptrn).each do |name|
            app = Appliance.new(name)
            id  = app.id

            # check for duplicate ID
            raise "Duplicate appliance ID #{id}" if new.has_key?(id)

            hash    = app.to_h(legacy: true, base_url: @base_url)
            new[id] = hash

            rel_name = name.delete_prefix(@dir)
            web[id]  = hash unless APPLIANCES_WEB_EXCLUDE && APPLIANCES_WEB_EXCLUDE.match?(rel_name)

            # Add app to cache in the corresponding version
            hash['opennebula_version'].split(',').each do |version|
                version             = version.strip
                @cache[version]     = {} unless @cache[version]
                @cache[version][id] = hash
            end
        end

        @appliances = new
        @web        = web
    end

    # Without a version: every appliance except the ones excluded from the web
    # listing. With a version: the appliances declared for it, or all of them
    # when no appliance declares that version.
    def get_all_list(version)
        return @web.values unless version

        return @appliances.values unless @cache[version]

        @cache[version].values
    end

    def get(id)
        @appliances[id]
    end

    def latest_one_version
        @cache.keys.empty? ? nil : @cache.keys.max_by {|v| v.split('.').map(&:to_i) }
    end

    def version?(version)
        return false if version.nil?

        @cache.key?(version)
    end

end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
