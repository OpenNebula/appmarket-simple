require 'appliance'

class Appliances

    def initialize(dir, base_url)
        @dir        = dir
        @base_url   = base_url
        @appliances = nil
        @cache      = {}

        reload
    end

    def reload
        if File.directory?(@dir)
            ptrn = @dir + '/appliances/**/*.yaml'
#        elsif File.file?(@dir)
#            ptrn = @dir
        else
            raise "Invalid source #{@dir}"
        end

        new    = {}
        @cache = {}

        Dir.glob(ptrn).each do |name|
            app = Appliance.new(name)
            id  = app.id

            # check for duplicate ID
            raise "Duplicate appliance ID #{id}" if new.has_key?(id)

            hash    = app.to_h(legacy: true, base_url: @base_url)
            new[id] = hash

            # Add app to cache in the corresponding version
            hash['opennebula_version'].split(',').each do |version|
                version             = version.strip
                @cache[version]     = {} unless @cache[version]
                @cache[version][id] = hash
            end
        end

        @appliances = new
    end

    def get_all_list(version)
        return @appliances.values unless version

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
