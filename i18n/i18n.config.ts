export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'it',
  fallbackLocale: 'it',

  messages: {
    it: {
      nav: {
        home: 'Home',
        artworks: 'Opere',
        artists: 'Artisti',
        exhibitions: 'Mostre',
        projects: 'Progetti'
      },
      home: {
        eyebrow: 'Contemporary Art Gallery',
        title: 'See the future of art',
        text: 'Il tuo tempo è limitato, quindi non sprecarlo vivendo la vita di qualcun altro. Non farti intrappolare dalle convenzioni, ma scopri la visione unica e la creatività dell’arte altrui.',
        primaryCta: 'Esplora le opere',
        secondaryCta: 'Vedi gli artisti',
        featured: 'In evidenza',
        latestArtworks: 'Ultime opere',
        allArtworks: 'Tutte le opere'
      },
      archive: {
        artworks: 'Opere',
        artists: 'Artisti',
        exhibitions: 'Mostre',
        projects: 'Progetti',
        foundArtworks: 'opere trovate',
        foundArtists: 'artisti trovati',
        foundExhibitions: 'mostre trovate',
        foundProjects: 'progetti trovati',
        loadingArtworks: 'Caricamento opere...',
        loadingArtists: 'Caricamento artisti...',
        loadingExhibitions: 'Caricamento mostre...',
        loadingProjects: 'Caricamento progetti...',
        previous: 'Precedente',
        next: 'Successiva'
      },
      card: {
        artwork: 'Opera',
        artist: 'Artista',
        exhibition: 'Mostra',
        project: 'Progetto',
        untitled: 'Senza titolo',
        unnamed: 'Senza nome'
      }
    },

    en: {
      nav: {
        home: 'Home',
        artworks: 'Artworks',
        artists: 'Artists',
        exhibitions: 'Exhibitions',
        projects: 'Projects'
      },
      home: {
        eyebrow: 'Contemporary Art Gallery',
        title: 'See the future of art',
        text: 'Your time is limited, so do not waste it living someone else’s life. Discover the unique vision and creativity of contemporary art.',
        primaryCta: 'Explore artworks',
        secondaryCta: 'View artists',
        featured: 'Featured',
        latestArtworks: 'Latest artworks',
        allArtworks: 'All artworks'
      },
      archive: {
        artworks: 'Artworks',
        artists: 'Artists',
        exhibitions: 'Exhibitions',
        projects: 'Projects',
        foundArtworks: 'artworks found',
        foundArtists: 'artists found',
        foundExhibitions: 'exhibitions found',
        foundProjects: 'projects found',
        loadingArtworks: 'Loading artworks...',
        loadingArtists: 'Loading artists...',
        loadingExhibitions: 'Loading exhibitions...',
        loadingProjects: 'Loading projects...',
        previous: 'Previous',
        next: 'Next'
      },
      card: {
        artwork: 'Artwork',
        artist: 'Artist',
        exhibition: 'Exhibition',
        project: 'Project',
        untitled: 'Untitled',
        unnamed: 'Unnamed'
      }
    }
  }
}))