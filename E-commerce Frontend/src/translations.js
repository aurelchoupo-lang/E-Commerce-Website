export const translations = {
  en: {
    common: {
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'Error',
      search: 'Search',
      actions: 'Actions',
      back: 'Back',
      confirm_delete: 'Are you sure you want to delete this? This action cannot be undone.',
      save_success: 'Saved successfully!',
      view_details: 'View Details',
      note: 'Note',
      pending: 'Pending',
      investigating: 'Investigating',
      resolved: 'Resolved',
      dismissed: 'Dismissed',
      all: 'All'
    },
    auth: {
      username: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      new_password: 'New Password',
      confirm_password: 'Confirm Password',
      invalid_email: 'Please enter a valid email address',
      password_min: 'Password must be at least 6 characters long',
      password_mismatch: 'Passwords do not match',
      login: {
        title: 'Welcome Back!',
        subtitle: 'Please sign in to continue',
        no_account: "Don't have an account?",
        register: 'Register',
        email: 'Email Address',
        password: 'Password',
        submit: 'Sign In',
        placeholder_email: 'you@example.com',
        placeholder_password: 'Your password',
        error_email: 'Please enter your email',
        error_valid_email: 'Please enter a valid email address',
        error_password: 'Please enter your password',
        failed: 'Login failed'
      },
      register: {
        title: 'Create an account',
        subtitle: 'Register as a Seller or Buyer to continue',
        has_account: 'Already have an account?',
        login: 'Login',
        name: 'Full Name',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        account_type: 'Account Type',
        buyer: 'Buyer',
        seller: 'Seller',
        submit: 'Create account',
        placeholder_name: 'Your full name',
        placeholder_email: 'you@example.com',
        placeholder_password: 'Choose a password',
        placeholder_confirm: 'Confirm your password',
        error_all: 'All fields are required',
        error_email: 'Please enter a valid email',
        error_match: 'Passwords do not match',
        failed: 'Registration failed'
      }
    },
    nav: {
      home: 'Home',
      sell_item: 'Sell Item',
      my_listings: 'My Listings',
      wishlist: 'My Wishlist',
      settings: 'Settings',
      login: 'Login',
      logout: 'Logout',
      admin: 'Admin',
      role_buyer: 'Buyer',
      role_seller: 'Seller',
      role_admin: 'Admin'
    },
    home: {
      welcome: 'Welcome to Marketplace',
      subtitle: 'Buy and sell items with ease. Find great deals near you.',
      search_placeholder: 'Search items...',
      items_found: 'items found',
      sort_by: 'Sort by:',
      newest: 'Newest First',
      oldest: 'Oldest First',
      price_low: 'Price: Low to High',
      price_high: 'Price: High to Low',
      title_az: 'Title A-Z',
      filters: {
        title: 'Advanced Filters',
        show: 'Show Advanced Filters',
        hide: 'Hide Advanced Filters',
        min_price: 'Min Price',
        max_price: 'Max Price',
        local: 'Local Products',
        durable: 'Durable Products',
        reset: 'Reset All Filters'
      },
      no_items: 'No items found',
      no_items_sub: 'Try adjusting your search or filters'
    },
    item: {
      condition: 'Condition',
      category: 'Category',
      location: 'Location',
      listed_on: 'Listed on',
      posted_on: 'Posted on',
      seller: 'Seller',
      description: 'Description',
      message: 'Message',
      contact_seller: 'Contact Seller',
      edit: 'Edit Listing',
      delete: 'Delete Listing',
      add_to_wishlist: 'Want to buy',
      remove_from_wishlist: 'Remove from wishlist',
      add_wishlist: 'Add to Wishlist',
      remove_wishlist: 'Remove from Wishlist',
      eco_impact: 'Eco Impact',
      reparability: 'Reparability',
      origin: 'Origin',
      eco: {
        title: 'Commitment & Responsibility',
        footprint: 'CO₂ Footprint',
        reparability: 'Reparability',
        origin: 'Origin',
        local_msg: 'This product is sold locally, reducing transport impact.',
        second_hand_msg: 'By buying secondhand, you avoid new waste production!'
      },
      form: {
        add_title: 'Sell Your Item',
        edit_title: 'Edit Listing',
        title: 'Title',
        price: 'Price (USD)',
        image: 'Item Image',
        image_url: 'Image URL',
        quantity: 'Quantity',
        upload: 'Upload File',
        preview: 'Preview:',
        creating: 'Creating...',
        updating: 'Updating...',
        submit_add: 'Create Listing',
        submit_edit: 'Save Changes',
        errors: {
          title: 'Title is required',
          desc: 'Description is required',
          price: 'Please enter a valid price',
          category: 'Please select a category',
          location: 'Location is required',
          image_url: 'Please enter a valid URL',
          image_file: 'Please select an image file'
        }
      }
    },
    settings: {
      title: 'Account Settings',
      subtitle: 'Manage your account preferences and security',
      account_info: 'Account Information',
      delete_account: 'Delete Account',
      tabs: {
        profile: 'Profile',
        security: 'Security',
        preferences: 'Preferences',
        account: 'Account',
        member_since: 'Member since'
      },
      profile: {
        title: 'Profile Information',
        name: 'Full Name',
        email: 'Email Address',
        role: 'Account Role',
        role_msg: 'Account role cannot be changed',
        update: 'Update Profile'
      },
      security: {
        title: 'Change Password',
        current: 'Current Password',
        new: 'New Password',
        confirm: 'Confirm New Password',
        update: 'Update Password'
      },
      preferences: {
        title: 'App Preferences',
        theme: 'Theme',
        language: 'Language',
        light: 'Light',
        dark: 'Dark',
        notifications: 'Push Notifications',
        email_updates: 'Email Updates',
        save: 'Save Preferences'
      }
    },
    admin: {
      dashboard: {
        title: 'Admin Dashboard',
        subtitle: 'Overview of marketplace activity',
        total_users: 'Total Users',
        active_listings: 'Active Listings',
        pending_reports: 'Pending Reports',
        revenue: 'Est. Revenue (5%)',
        quick_actions: 'Quick Actions',
        manage_users: 'Manage Users',
        review_reports: 'Review Reports',
        manage_items: 'Manage Items',
        recent_activity: {
          title: 'Recent Activity',
          user_reg: 'New user registered',
          item_rep: 'Item reported for review',
          item_list: 'New item listed',
          item_sold: 'Item marked as sold'
        }
      },
      users: {
        title: 'User Management',
        subtitle: 'Manage user accounts and permissions',
        search: 'Search Users',
        filter_role: 'Filter by Role',
        all_roles: 'All Roles',
        table_user: 'User',
        table_role: 'Role',
        table_joined: 'Joined',
        modal_role_title: 'Change User Role',
        modal_delete_title: 'Delete User',
        delete_confirm: 'Are you sure you want to delete this account?'
      },
      reports: {
        title: 'Reports Management',
        subtitle: 'Review and handle reported content',
        filter_status: 'Filter by Status',
        reasons: {
          fraud: 'Fraud/Scam',
          inappropriate: 'Inappropriate Content',
          spam: 'Spam',
          counterfeit: 'Counterfeit'
        }
      },
      items: {
        title: 'Items Management',
        subtitle: 'Manage all marketplace listings',
        search: 'Search Items',
        filter_category: 'Filter by Category',
        table_item: 'Item',
        table_price: 'Price',
        table_seller: 'Seller',
        table_listed: 'Listed on',
        modal_delete_title: 'Delete Item',
        delete_confirm: 'Are you sure you want to delete this listing? This action cannot be undone.'
      }
    },
    footer: {
      about_title: 'Marketplace',
      about_text: 'Your trusted platform for buying and selling items online. Connect with local sellers and find great deals.',
      quick_links: 'Quick Links',
      buy_item: 'Buy Items',
      sell_item: 'Sell Item',
      connect: 'Connect',
      rights: 'All rights reserved. Built with React & Tailwind CSS.',
      contact_title: 'Contact Cypher Sentry',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        message: 'Your Message',
        submit: 'Send Message'
      }
    }
  },
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      loading: 'Chargement...',
      error: 'Erreur',
      search: 'Rechercher',
      actions: 'Actions',
      back: 'Retour',
      confirm_delete: 'Êtes-vous sûr de vouloir supprimer ceci ? Cette action est irréversible.',
      save_success: 'Enregistré avec succès !',
      view_details: 'Voir les détails',
      note: 'Note',
      pending: 'En attente',
      investigating: 'En cours d\'examen',
      resolved: 'Résolu',
      dismissed: 'Rejeté',
      all: 'Tous'
    },
    auth: {
      username: 'Nom complet',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      new_password: 'Nouveau mot de passe',
      confirm_password: 'Confirmer le mot de passe',
      invalid_email: 'Veuillez entrer une adresse e-mail valide',
      password_min: 'Le mot de passe doit contenir au moins 6 caractères',
      password_mismatch: 'Les mots de passe ne correspondent pas',
      login: {
        title: 'Bon retour !',
        subtitle: 'Veuillez vous connecter pour continuer',
        no_account: "Vous n'avez pas de compte ?",
        register: "S'inscrire",
        email: 'Adresse e-mail',
        password: 'Mot de passe',
        submit: 'Se connecter',
        placeholder_email: 'vous@exemple.com',
        placeholder_password: 'Votre mot de passe',
        error_email: 'Veuillez entrer votre e-mail',
        error_valid_email: 'Veuillez entrer une adresse e-mail valide',
        error_password: 'Veuillez entrer votre mot de passe',
        failed: 'Échec de la connexion'
      },
      register: {
        title: 'Créer un compte',
        subtitle: 'Inscrivez-vous en tant que vendeur ou acheteur pour continuer',
        has_account: 'Vous avez déjà un compte ?',
        login: 'Connexion',
        name: 'Nom complet',
        email: 'E-mail',
        password: 'Mot de passe',
        confirm_password: 'Confirmer le mot de passe',
        account_type: 'Type de compte',
        buyer: 'Acheteur',
        seller: 'Vendeur',
        submit: 'Créer le compte',
        placeholder_name: 'Votre nom complet',
        placeholder_email: 'vous@exemple.com',
        placeholder_password: 'Choisissez un mot de passe',
        placeholder_confirm: 'Confirmez le mot de passe',
        error_all: 'Tous les champs sont obligatoires',
        error_email: 'Veuillez entrer un e-mail valide',
        error_match: 'Les mots de passe ne correspondent pas',
        failed: "Échec de l'inscription"
      }
    },
    nav: {
      home: 'Accueil',
      sell_item: 'Vendre un article',
      my_listings: 'Mes annonces',
      wishlist: 'Mes favoris',
      settings: 'Paramètres',
      login: 'Connexion',
      logout: 'Déconnexion',
      admin: 'Admin',
      role_buyer: 'Acheteur',
      role_seller: 'Vendeur',
      role_admin: 'Admin'
    },
    home: {
      welcome: 'Bienvenue sur Marketplace',
      subtitle: 'Achetez et vendez facilement. Trouvez de bonnes affaires près de chez vous.',
      search_placeholder: 'Rechercher des articles...',
      items_found: 'articles trouvés',
      sort_by: 'Trier par :',
      newest: 'Plus récent',
      oldest: 'Plus ancien',
      price_low: 'Prix : croissant',
      price_high: 'Prix : décroissant',
      title_az: 'Titre A-Z',
      filters: {
        title: 'Filtres avancés',
        show: 'Afficher les filtres avancés',
        hide: 'Masquer les filtres avancés',
        min_price: 'Prix min',
        max_price: 'Prix max',
        local: 'Produits Locaux',
        durable: 'Produits Durables',
        reset: 'Réinitialiser tous les filtres'
      },
      no_items: 'Aucun article trouvé',
      no_items_sub: 'Essayez d\'ajuster votre recherche ou vos filtres'
    },
    item: {
      condition: 'État',
      category: 'Catégorie',
      location: 'Lieu',
      listed_on: 'Publié le',
      posted_on: 'Publié le',
      seller: 'Vendeur',
      description: 'Description',
      message: 'Message',
      contact_seller: 'Contacter le vendeur',
      edit: 'Modifier l\'annonce',
      delete: 'Supprimer l\'annonce',
      add_to_wishlist: 'Je veux acheter',
      remove_from_wishlist: 'Retirer de la liste',
      add_wishlist: 'Ajouter aux favoris',
      remove_wishlist: 'Retirer des favoris',
      eco_impact: 'Impact écologique',
      reparability: 'Réparabilité',
      origin: 'Provenance',
      eco: {
        title: 'Engagement & Responsabilité',
        footprint: 'Empreinte CO₂',
        reparability: 'Réparabilité',
        origin: 'Provenance',
        local_msg: 'Ce produit est vendu localement, réduisant ainsi l\'impact du transport.',
        second_hand_msg: 'En achetant d\'occasion, vous évitez la production de nouveaux déchets !'
      },
      form: {
        add_title: 'Vendre votre article',
        edit_title: 'Modifier l\'annonce',
        title: 'Titre',
        price: 'Prix (USD)',
        image: 'Image de l\'article',
        image_url: 'URL de l\'image',
        quantity: 'Quantité',
        upload: 'Télécharger un fichier',
        preview: 'Aperçu :',
        creating: 'Création...',
        updating: 'Mise à jour...',
        submit_add: 'Créer l\'annonce',
        submit_edit: 'Enregistrer les modifications',
        errors: {
          title: 'Le titre est obligatoire',
          desc: 'La description est obligatoire',
          price: 'Veuillez entrer un prix valide',
          category: 'Veuillez sélectionner une catégorie',
          location: 'Le lieu est obligatoire',
          image_url: 'Veuillez entrer une URL valide',
          image_file: 'Veuillez sélectionner un fichier image'
        }
      }
    },
    settings: {
      title: 'Paramètres du compte',
      subtitle: 'Gérez vos préférences de compte et votre sécurité',
      tabs: {
        profile: 'Profil',
        security: 'Sécurité',
        preferences: 'Préférences',
        account: 'Compte',
        member_since: 'Membre depuis'
      },
      profile: {
        title: 'Informations du profil',
        name: 'Nom complet',
        email: 'Adresse e-mail',
        role: 'Rôle du compte',
        role_msg: 'Le rôle du compte ne peut pas être modifié',
        update: 'Mettre à jour le profil'
      },
      security: {
        title: 'Changer le mot de passe',
        current: 'Mot de passe actuel',
        new: 'Nouveau mot de passe',
        confirm: 'Confirmer le nouveau mot de passe',
        update: 'Mettre à jour le mot de passe'
      },
      preferences: {
        title: 'Préférences de l\'application',
        theme: 'Thème',
        language: 'Langue',
        light: 'Clair',
        dark: 'Sombre',
        notifications: 'Notifications Push',
        email_updates: 'Mises à jour par e-mail',
        save: 'Enregistrer les préférences'
      }
    },
    admin: {
      dashboard: {
        title: 'Tableau de bord Admin',
        subtitle: 'Aperçu de l\'activité de la marketplace',
        total_users: 'Utilisateurs totaux',
        active_listings: 'Annonces actives',
        pending_reports: 'Signalements en attente',
        revenue: 'Revenus est. (5%)',
        quick_actions: 'Actions rapides',
        manage_users: 'Gérer les utilisateurs',
        review_reports: 'Examiner les signalements',
        manage_items: 'Gérer les articles',
        recent_activity: {
          title: 'Activité récente',
          user_reg: 'Nouvel utilisateur inscrit',
          item_rep: 'Article signalé pour examen',
          item_list: 'Nouvel article publié',
          item_sold: 'Article marqué comme vendu'
        }
      },
      users: {
        title: 'Gestion des utilisateurs',
        subtitle: 'Gérer les comptes d\'utilisateurs et les permissions',
        search: 'Rechercher des utilisateurs',
        filter_role: 'Filtrer par rôle',
        all_roles: 'Tous les rôles',
        table_user: 'Utilisateur',
        table_role: 'Rôle',
        table_joined: 'Inscrit le',
        modal_role_title: 'Changer le rôle de l\'utilisateur',
        modal_delete_title: 'Supprimer l\'utilisateur',
        delete_confirm: 'Êtes-vous sûr de vouloir supprimer ce compte ?'
      },
      reports: {
        title: 'Gestion des rapports',
        subtitle: 'Examiner et traiter les contenus signalés',
        filter_status: 'Filtrer par statut',
        reasons: {
          fraud: 'Fraude/Arnaque',
          inappropriate: 'Contenu inapproprié',
          spam: 'Spam',
          counterfeit: 'Contrefaçon'
        }
      },
      items: {
        title: 'Gestion des articles',
        subtitle: 'Gérer toutes les annonces de la marketplace',
        search: 'Rechercher des articles',
        filter_category: 'Filtrer par catégorie',
        table_item: 'Article',
        table_price: 'Prix',
        table_seller: 'Vendeur',
        table_listed: 'Publié le',
        modal_delete_title: 'Supprimer l\'article',
        delete_confirm: 'Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.'
      }
    },
    footer: {
      about_title: 'Marketplace',
      about_text: 'Votre plateforme de confiance pour acheter et vendre des articles en ligne. Connectez-vous avec des vendeurs locaux et trouvez de bonnes affaires.',
      quick_links: 'Liens rapides',
      buy_item: 'Acheter des articles',
      sell_item: 'Vendre un article',
      connect: 'Connecter',
      rights: 'Tous droits réservés. Construit avec React & Tailwind CSS.',
      contact_title: 'Contacter Cypher Sentry',
      form: {
        name: 'Nom complet',
        email: 'Adresse e-mail',
        message: 'Votre message',
        submit: 'Envoyer le message'
      }
    }
  }
};
