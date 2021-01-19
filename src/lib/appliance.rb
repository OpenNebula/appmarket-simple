require 'yaml'
require 'json'
require 'appliance/image'
require 'securerandom'

class Appliance
    attr_reader :id, :name, :version, :publisher, :description
    attr_reader :tags, :creation_time, :opennebula_template
    attr_reader :images, :opennebula_version, :creation_time
    attr_reader :os_id, :os_release, :os_arch, :format, :hypervisor, :logo, :type, :roles, :disks

    def initialize(file=nil)
        @id = nil
        @name = nil
        @version = nil
        @publisher = nil
        @description = nil
        @short_description = nil
        @tags = nil
        @creation_time = nil
        @opennebula_template = nil
        @opennebula_version = nil
        @os_id = nil
        @os_release = nil
        @os_arch = nil
        @format = nil
        @hypervisor = nil
        @logo = nil
        @images = []
        @type = nil
        @roles = []
        @disks = []
        self.read_yaml(file) if file
    end

    def id=(value)
        @id = value
    end

    def name=(value)
        @name = strip_or_nil(value)
    end

    def version=(value)
        @version = strip_or_nil(value)
    end

    def publisher=(value)
        @publisher = strip_or_nil(value)
    end

    def description=(value)
        @description = strip_or_nil(value)
        @description.gsub!(/\r\n/,"\n") if @description
    end

    def short_description=(value)
        @short_description = strip_or_nil(value)
    end

    def tags=(value)
        if value.nil?
            @tags = value
        else
            # stripped non-empty tags
            @tags = [value].join(',').split(',')
                .collect(&:strip)
                .delete_if(&:empty?)
        end
    end

    def format=(value)
        @format = strip_or_nil(value)
    end

    def type=(value)
        @type = strip_or_nil(value)
    end

    def roles=(value)
        @roles = value
    end

    def disks=(value)
        @disks = value
    end

    def creation_time_str
        Time.at(@creation_time).utc.to_datetime if @creation_time
    end

    def creation_time=(value)
        @creation_time = value.nil? ? value : value.to_i
    end

    def opennebula_template=(value)
        if value.nil? or value.is_a? Hash
            @opennebula_template = value
        else
            begin
                @opennebula_template = JSON.parse(value)
            rescue JSON::ParserError
                raise "Invalid template format, JSON required"
            end
        end
    end

    def opennebula_version=(value)
        @opennebula_version = strip_or_nil(value)
    end

    def os_id=(value)
        @os_id = strip_or_nil(value)
    end

    def os_release=(value)
        @os_release= strip_or_nil(value)
    end

    def os_arch=(value)
        @os_arch = strip_or_nil(value)
    end

    def hypervisor=(value)
        @hypervisor = strip_or_nil(value)
    end

    def logo=(value)
        @logo = strip_or_nil(value)

        @logo = @logo.split('/').last if @logo
    end

    ###

    KEYS = %w(id name version publisher description short_description tags format
              creation_time opennebula_template opennebula_version
              os-id os-release os-arch hypervisor logo type roles disks)

    def from_options(options)
        KEYS.each { |opt|
            if options.key?(opt.to_sym)
                opt_priv = opt.gsub(/-/, '_')
                self.send("#{opt_priv}=", options[opt.to_sym])
            end
        }

        if self.images && options[:image_index] < self.images.size
            img = self.images[ options[:image_index] ]
        else
            img = Appliance::Image.new()
        end

        img.from_options(options)
        unless img.to_h.empty? or self.images.include?(img)
            self.images << img
        end

#        img = Appliance::Image.new()
#        img.from_options(options)
#        self.images << img unless img.to_h.empty?
    end

    def from_h(data)
        KEYS.each { |k|
            k_priv = k.gsub(/-/, '_')
            self.send("#{k_priv}=", data[k])
#            self.instance_variable_set("@#{k}", data[k])
        }

        @images = []
        if data["images"].is_a? Array
            data["images"].each { |image|
                @images << Appliance::Image.new(image)
            }
        end
    end

    def to_h(legacy: false, with_id: false, base_url: "http://localhost:9292")
        template = nil

        # legacy (ON marketplace) key names
        if legacy
            k_imgs = 'files'

            if @opennebula_template
                if @type != 'SERVICE_TEMPLATE'
                    template = JSON.generate(
                        tmpl_fixkeys(@opennebula_template, true)
                    )
                else
                    template = JSON.generate(@opennebula_template)
                end
            end
        else
            k_imgs = 'images'

            if @opennebula_template
                template = tmpl_fixkeys(@opennebula_template, false)
            end
        end

        data = {}

        if legacy
            data['_id'] = { '$oid' => @id }

            url = "#{base_url}/appliance/#{@id}/download"
            data['links'] =  { 'download' => { 'href' => url } }
        elsif with_id
            data['id'] = @id
        end

        data.merge!({
            'name'                => @name,
            'version'             => @version,
            'publisher'           => @publisher,
            'description'         => @description,
            'short_description'   => @short_description,
            'tags'                => @tags,
            'format'              => @format,
            'creation_time'       => @creation_time,
            'os-id'               => @os_id,
            'os-release'          => @os_release,
            'os-arch'             => @os_arch,
            'hypervisor'          => @hypervisor,
            'opennebula_version'  => @opennebula_version,
            'opennebula_template' => template,
            'logo'                => @logo,
            'type'                => @type,
            'roles'               => @roles,
            'disks'               => @disks,
            'md5'                 => @md5
        })

        # app. images
        if !@images.nil? and !@images.empty?
            data[k_imgs] = []
            @images.each { |image|
                i = image.to_h(legacy)
                if legacy
                    i['hypervisor'] = @hypervisor
                    i['os-arch'] = @os_arch
                    i['format'] = @format
                end
                data[k_imgs] << i
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

        if @id.nil?
            raise "Unknown unique ID"
        end
    end

    def write_yaml(name=nil)
        yaml = self.to_h.to_yaml(:line_width => 70)

        if name.nil?
            puts yaml
        else
            tmpfile = Tempfile.new(File.basename("#{name}."), File.dirname(name))
            begin
                tmpfile.write(yaml)
                tmpfile.close
                File.rename(tmpfile.path, name)
            rescue
                tmpfile.close
                tmpfile.unlink
            end
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

    private
    def strip_or_nil(value)
        if value.nil?
            value
        else
            value.to_s.strip
        end
    end
end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
