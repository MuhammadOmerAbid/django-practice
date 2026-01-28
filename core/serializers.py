from rest_framework import serializers
from django.contrib.auth.models import User  # or your CustomUser if you have one

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # fields to expose
