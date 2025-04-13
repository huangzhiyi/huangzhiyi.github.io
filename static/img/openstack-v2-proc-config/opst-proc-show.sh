#!/usr/bin/env bash
systemctl -a |grep -E "UNIT|chronyd|memcached|rabbitmq|mariadb|glance|httpd\.s|etcd|nova|neutron|libvirtd\.ser"

