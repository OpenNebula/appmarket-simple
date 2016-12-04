require 'appliance'

class Appliances
    def initialize(dir)
        @dir = dir
        @appliances = nil
        self.reload
    end

    def reload
        if File.directory?(@dir)
            ptrn = @dir + '/**/*.yaml'
#        elsif File.file?(@dir)
#            ptrn = @dir
        else
            raise "Invalid source #{@dir}"
        end

        new = {}
        Dir.glob(ptrn).each { |name|
            app = Appliance.new(name)
            id = app.id

            # chek for duplicate ID
            if new.has_key?(id)
                raise "Duplicate appliance ID #{id}"
            end

            new[id] = app.to_h(true)
        }
        @appliances = new
    end

    def get_all_list
        @appliances.values
    end

    def get(id)
        @appliances[id]
    end
end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
