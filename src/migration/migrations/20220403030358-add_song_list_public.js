const SONG_LIST = [
  {
    title: 'Sweet Child O\' Mine',
    album: 'Appetite for Destruction',
    duration: '5:56',
    author: 'Guns N\' Roses'
  },
  {
    title: 'We Will Rock You',
    album: 'News Of The World (2011 Remaster)',
    duration: '2:02',
    author: 'Queen'
  },
  {
    title: 'Last Kiss',
    album: 'Last Kiss',
    duration: '3.15',
    author: 'Pearl Jam'
  },
  {
    title: 'Bitter Sweet Symphony',
    album: 'Urban Hymns',
    duration: '5:58',
    author: 'The Verve'
  },
  {
    title: 'Modern Love',
    album: 'Let\'s Dance',
    duration: '4:48',
    author: 'David Bowie'
  },
  {
    title: 'Back in Black',
    album: 'Back in Black',
    duration: '4:15',
    author: 'AC/DC'
  },
  {
    title: 'Sweet Child O\' Mine',
    album: 'Appetite for Destruction',
    duration: '5:56',
    author: 'Guns N\' Roses'
  },
  {
    title: 'Welcome To The Jungle',
    album: 'Appetite for Destruction',
    duration: '4:32',
    author: 'Guns N\' Roses'
  },
  {
    title: 'No Rain',
    album: 'Blind Melon',
    duration: '3:37',
    author: 'Blind Melon'
  },
  {
    title: 'You Shook Me All Night Long',
    album: 'Back in Black',
    duration: '3:30',
    author: 'AC/DC'
  }
];

module.exports = {
  async up(db, client) {

    const promiseSongList = SONG_LIST.map(song => {
      return db.collection('users').updateOne({
        email: 'user@public.com'
      }, {
        $push: {
          songs: song
        }
      });
    });

    await Promise.all(promiseSongList);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    await db.collection('users').updateOne({email: 'user@public.com'}, {$set: {songs: []}});
  }
};
