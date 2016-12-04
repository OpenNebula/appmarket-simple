require 'yaml'
require 'json'
require 'appliance/image'

class Appliance
    attr_reader :id

    def initialize(file=nil)
        @id = nil
        @name = nil
        @version = nil
        @publisher = nil
        @description = nil
        @tags = nil
        @creation_time = nil
        @opennebula_template = nil
        @files = []
        self.read_yaml(file) if file
    end

    def from_h(data)
        %w(id name version publisher description tags format
        creation_time opennebula_template).each { |k|
            self.instance_variable_set("@#{k}", data[k])
        }

        @files = []
        if data["files"].is_a? Array
            data["files"].each { |file|
                @files << Appliance::Image.new(file)
            }
        end
    end

    def to_h(legacy=false, with_id=false)
        template = nil

        # legacy (ON marketplace) key names
        if legacy
            k_desc = 'short_description'

            if @opennebula_template
                template = JSON.generate(
                    tmpl_fixkeys(@opennebula_template, true)
                )
            end
        else
            k_desc = 'description'

            if @opennebula_template
                template = tmpl_fixkeys(@opennebula_template, false)
            end
        end

        data = {}

        # app. ID
        if legacy 
            data['_id'] = { '$oid' => @id }
        elsif with_id
            data['id'] = @id
        end

        data.merge!({
            'name'                => @name,
            'version'             => @version,
            'publisher'           => @publisher,
            k_desc                => @description,
            'tags'                => @tags,
            'format'              => @format,
            'creation_time'       => @creation_time,
            'opennebula_template' => template
        })

        # app. files
        if !@files.nil? and !@files.empty?
            data["files"] = []
            @files.each { |file|
                data["files"] << file.to_h(legacy)
            }
        end

        # remove undefined entries
        data.delete_if { |k, v| v.nil?  }
    end

    def read_yaml(name)
        begin
            app = YAML.load_file(name)
        rescue Exception => e
            raise "Error parsing #{name}: #{e.message}"
        end

        # single appliance - if no id is in metadata,
        # take the filename without extension
        unless app.is_a? Hash
            raise "Appliance is not hash"
        end

        self.from_h(app)

        # multiple ways where to find unique ID
        if app.key?("_id") and app["_id"].key?("$oid")
            @id = app["_id"]["$oid"]
        elsif !app.key?("id")
            @id = File.basename(name, '.yaml')
        end
    end

    def write_yaml(name)
        begin
            File.open(name, 'w') { |file|
                file.write(self.to_h(true).to_yaml(:line_width => 70))
            }   
        rescue
            File.unlink(name)
        end
    end

    private
    def tmpl_fixkeys(template, upcase)
        new = {}
        template.each { |key, value|
            if upcase
                name = key.to_s.upcase
            else
                name = key.to_s.downcase
            end

            if value.is_a? Hash
                new[name] = tmpl_fixkeys(value, upcase)
            else
                new[name] = value
            end
        }   
        new 
    end
end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
