import React, { useState, useRef, useEffect} from 'react';
import Swal from 'sweetalert2';
// useNavigate ha sido eliminado ya que no se está utilizando
import './AdminPanel.css';

const API_BASE = 'http://localhost:3000/api';

interface Post {
  id: string;    
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
}

interface PostFormData {
  title: string;
  description: string;
  url: string;
  image: File | null;
  tags: string[];
}

const TAGS_OPTIONS = [
  'HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'MongoDB',
  'Mongoose', 'bcrypt', 'dotenv', 'SweetAlert2', 'Git', 'GitHub',
  'Postman', 'MongoDB Atlas'
];

const AdminPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setUserEmail(email);
  }, []);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    url: '',
    image: null,
    tags: []
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Posts traídos de MongoDB vía API
const [posts, setPosts] = useState<Post[]>([]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    Swal.fire({
   title: '¿Seguro que deseas eliminar este post?',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonText: 'Sí, eliminar',
   cancelButtonText: 'Cancelar'
 }).then(result => {
   if (result.isConfirmed) {
     fetch(`${API_BASE}/links/${id}`, { method: 'DELETE' })
       .then(res => {
         if (res.status === 204) {
           setPosts(posts.filter(p => p.id !== id));
           Swal.fire('Eliminado', 'El post ha sido eliminado.', 'success');
         } else {
           Swal.fire('Error', 'No se pudo eliminar.', 'error');
         }
       });
   }
 });
};

  const handleEdit = (id: string) => {
    const postToEdit = posts.find(post => post.id === id);
    if (postToEdit) {
      handleEditPost(postToEdit);
    }
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      description: '',
      url: '',
      image: null,
      tags: []
    });
    setImagePreview(null);
    setShowPostForm(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      url: post.url,
      image: null,
      tags: [...post.tags]
    });
    setImagePreview(post.image);
    setShowPostForm(true);
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setEditingPost(null);
    setFormData({
      title: '',
      description: '',
      url: '',
      image: null,
      tags: []
    });
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1) Validar URL si está presente
if (formData.url && !/^https?:\/\//i.test(formData.url)) {
   await Swal.fire('URL inválida', 'Por favor ingresa una URL válida que comience con http:// o https://', 'warning');
   return;
 }
  try {
    if (editingPost) {
      // 2A) EDITAR post existente
      const res = await fetch(`${API_BASE}/links/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:       formData.title,
          description: formData.description,
          url:         formData.url,
          image:       imagePreview || editingPost.image,
          tags:        formData.tags
        })
      });
      if (!res.ok) throw new Error('Error actualizando el post');
      const updated = await res.json();

      // 3A) Reflejar cambio en estado
      setPosts(posts.map(p =>
        p.id === editingPost.id
          ? {
              id:          updated._id,
              title:       updated.title,
              description: updated.description,
              url:         updated.url,
              image:       updated.image,
              tags:        updated.tags
            }
          : p
      ));
    } else {
      // 2B) CREAR nuevo post
      const res = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:       formData.title,
          description: formData.description,
          url:         formData.url,
          image:       imagePreview || '',
          tags:        formData.tags
        })
      });
      if (!res.ok) throw new Error('Error creando el post');
      const created = await res.json();

      // 3B) Añadir a estado
      setPosts([
        ...posts,
        {
          id:          created._id,
          title:       created.title,
          description: created.description,
          url:         created.url,
          image:       created.image,
          tags:        created.tags
        }
      ]);
    }

    // 4) Cerrar formulario
    handleCloseForm();
    await Swal.fire('¡Listo!', editingPost ? 'Post actualizado' : 'Post creado', 'success');
  } catch (err: any) {
    console.error(err);
    Swal.fire('Error', err.message, 'error');    
  }
};

useEffect(() => {
  // Al montar, traemos todos los links
  fetch(`${API_BASE}/links`)
    .then(res => res.json())
    .then((raw: any[]) => {
      const normalized: Post[] = raw.map(l => ({
        id: l._id,               // <- aquí
        title: l.title,
        description: l.description,
        image: l.image || '',
        url: l.url,
        tags: l.tags || []
      }));
      setPosts(normalized);
    })
    .catch(err => console.error('Error cargando posts:', err));
}, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-user-info">
  <h2>Bienvenido, {localStorage.getItem('username')}</h2>
  <p>{userEmail}</p>
</div>
        <button 
          className="create-post-button"
          onClick={handleCreatePost}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Crear nuevo post
        </button>
      </div>

      {/* Contenido principal */}
      <div className="admin-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            Buscar
          </button>
        </div>

        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Imagen</th>
                <th>URL</th>
                <th>Etiquetas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td className="description-cell">{post.description}</td>
                  <td>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="post-thumbnail"
                    />
                  </td>
                  <td>
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      Ver post
                    </a>
                  </td>
                  <td>
                    <div className="post-tags">
                      {post.tags.map(tag => (
                        <span key={tag} className="post-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(post.id)}
                      aria-label="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(post.id)}
                      aria-label="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Crear Post */}
      {showPostForm && (
        <div className="modal-overlay">
          <div className="post-form-container">
            <div className="post-form-header">
              <h2>{editingPost ? 'Editar Post' : 'Crear Post'}</h2>
              <button className="close-form-btn" onClick={handleCloseForm}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="post-form">
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Título del post"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Descripción del post"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="url">URL del recurso</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com"
                  pattern="https?://.+"
                  title="Por favor ingresa una URL válida que comience con http:// o https://"
                />
                <small className="field-hint">Opcional - Asegúrate de incluir http:// o https://</small>
              </div>
              
              <div className="form-group">
                <label>Imagen</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="upload-image-btn"
                  onClick={triggerFileInput}
                >
                  Subir Imagen
                </button>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Etiquetas</label>
                <div className="tags-container">
                  {TAGS_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag ${formData.tags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={handleCloseForm}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
