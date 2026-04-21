from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Material, Comment, Favorite, Note, ViewHistory
from .serializers import MaterialSerializer, CommentSerializer, FavoriteSerializer, NoteSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all().order_by('-created_at')
    serializer_class = MaterialSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        material = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, material=material)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_favorite(self, request, pk=None):
        material = self.get_object()
        favorite, created = Favorite.objects.get_or_create(user=request.user, material=material)
        if created:
            return Response({'message': 'Добавлено в избранное'})
        return Response({'message': 'Уже в избранном'})
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        material = self.get_object()
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, material=material)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def view(self, request, pk=None):
        material = self.get_object()
        if request.user.is_authenticated:
            ViewHistory.objects.create(user=request.user, material=material)
        return Response({'message': 'Просмотр зафиксирован'})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)