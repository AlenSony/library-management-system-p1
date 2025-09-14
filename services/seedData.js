const mongoose = require('mongoose');

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/LibraryManagementSystem";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB for seeding");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Define schemas (same as in index.js)
const ReaderSchema = new mongoose.Schema(
  {
    readerID: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

const AuthorSchema = new mongoose.Schema({
  authorID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const PublisherSchema = new mongoose.Schema({
  publisherID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  yearOfPublication: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const BookSchema = new mongoose.Schema(
  {
    bookID: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
    edition: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const StaffSchema = new mongoose.Schema({
  staffID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const BookIssueSchema = new mongoose.Schema({
  reader_name: {
    type: String,
    required: true,
  },
  book_name: {
    type: String,
    required: true,
  },
  readerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reader",
    required: true,
  },
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['issued', 'returned', 'overdue'],
    default: 'issued',
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
}, { timestamps: true });

const Reader = mongoose.model("Reader", ReaderSchema);
const Author = mongoose.model("Author", AuthorSchema);
const Publisher = mongoose.model("Publisher", PublisherSchema);
const Book = mongoose.model("Book", BookSchema);
const Staff = mongoose.model("Staff", StaffSchema);
const BookIssue = mongoose.model("Book_Issue", BookIssueSchema);

// Mock data
const mockData = {
  authors: [
    {
      authorID: "AUTH001",
      name: "J.K. Rowling",
      email: "jkrowling@email.com"
    },
    {
      authorID: "AUTH002", 
      name: "George R.R. Martin",
      email: "grrmartin@email.com"
    },
    {
      authorID: "AUTH003",
      name: "Harper Lee",
      email: "harperlee@email.com"
    },
    {
      authorID: "AUTH004",
      name: "F. Scott Fitzgerald",
      email: "fscott@email.com"
    },
    {
      authorID: "AUTH005",
      name: "Jane Austen",
      email: "janeausten@email.com"
    }
  ],
  publishers: [
    {
      publisherID: "PUB001",
      name: "Penguin Random House",
      yearOfPublication: 1935
    },
    {
      publisherID: "PUB002",
      name: "HarperCollins",
      yearOfPublication: 1817
    },
    {
      publisherID: "PUB003",
      name: "Simon & Schuster",
      yearOfPublication: 1924
    },
    {
      publisherID: "PUB004",
      name: "Macmillan Publishers",
      yearOfPublication: 1843
    },
    {
      publisherID: "PUB005",
      name: "Hachette Book Group",
      yearOfPublication: 1826
    }
  ],
  staff: [
    {
      staffID: "STAFF001",
      name: "Sarah Johnson"
    },
    {
      staffID: "STAFF002",
      name: "Michael Chen"
    },
    {
      staffID: "STAFF003",
      name: "Emily Rodriguez"
    },
    {
      staffID: "STAFF004",
      name: "David Thompson"
    }
  ],
  readers: [
    {
      readerID: "READER001",
      name: "Alice Smith",
      email: "alice.smith@email.com",
      phone: "555-0101",
      password: "password123",
      address: "123 Main St, Anytown, USA"
    },
    {
      readerID: "READER002",
      name: "Bob Wilson",
      email: "bob.wilson@email.com",
      phone: "555-0102",
      password: "password123",
      address: "456 Oak Ave, Somewhere, USA"
    },
    {
      readerID: "READER003",
      name: "Carol Davis",
      email: "carol.davis@email.com",
      phone: "555-0103",
      password: "password123",
      address: "789 Pine Rd, Elsewhere, USA"
    },
    {
      readerID: "READER004",
      name: "Daniel Brown",
      email: "daniel.brown@email.com",
      phone: "555-0104",
      password: "password123",
      address: "321 Elm St, Nowhere, USA"
    },
    {
      readerID: "READER005",
      name: "Eva Garcia",
      email: "eva.garcia@email.com",
      phone: "555-0105",
      password: "password123",
      address: "654 Maple Dr, Anywhere, USA"
    }
  ]
};

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data in reverse order of dependencies
    await BookIssue.deleteMany({});
    await Book.deleteMany({});
    await Reader.deleteMany({});
    await Staff.deleteMany({});
    await Publisher.deleteMany({});
    await Author.deleteMany({});
    console.log("Cleared existing data");

    // Insert authors
    const authors = [];
    for (const author of mockData.authors) {
      try {
        const newAuthor = await Author.create(author);
        authors.push(newAuthor);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Author ${author.authorID} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log(`Inserted ${authors.length} authors`);

    // Insert publishers
    const publishers = [];
    for (const publisher of mockData.publishers) {
      try {
        const newPublisher = await Publisher.create(publisher);
        publishers.push(newPublisher);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Publisher ${publisher.publisherID} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log(`Inserted ${publishers.length} publishers`);

    // Insert staff
    const staff = [];
    for (const staffMember of mockData.staff) {
      try {
        const newStaff = await Staff.create(staffMember);
        staff.push(newStaff);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Staff member ${staffMember.staffID} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log(`Inserted ${staff.length} staff members`);

    // Insert readers
    const readers = [];
    for (const reader of mockData.readers) {
      try {
        const newReader = await Reader.create(reader);
        readers.push(newReader);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Reader ${reader.readerID} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log(`Inserted ${readers.length} readers`);

    // Insert books
    const bookData = [
      {
        bookID: "BOOK001",
        title: "Harry Potter and the Philosopher's Stone",
        author: authors[0]._id,
        publisher: publishers[0]._id,
        edition: "1st Edition",
        price: 12.99,
        availability: true,
        stock: 5
      },
      {
        bookID: "BOOK002",
        title: "A Game of Thrones",
        author: authors[1]._id,
        publisher: publishers[1]._id,
        edition: "1st Edition",
        price: 15.99,
        availability: true,
        stock: 3
      },
      {
        bookID: "BOOK003",
        title: "To Kill a Mockingbird",
        author: authors[2]._id,
        publisher: publishers[2]._id,
        edition: "50th Anniversary Edition",
        price: 14.99,
        availability: true,
        stock: 7
      },
      {
        bookID: "BOOK004",
        title: "The Great Gatsby",
        author: authors[3]._id,
        publisher: publishers[3]._id,
        edition: "Classic Edition",
        price: 11.99,
        availability: true,
        stock: 4
      },
      {
        bookID: "BOOK005",
        title: "Pride and Prejudice",
        author: authors[4]._id,
        publisher: publishers[4]._id,
        edition: "Penguin Classics",
        price: 9.99,
        availability: true,
        stock: 6
      },
      {
        bookID: "BOOK006",
        title: "Harry Potter and the Chamber of Secrets",
        author: authors[0]._id,
        publisher: publishers[0]._id,
        edition: "1st Edition",
        price: 12.99,
        availability: true,
        stock: 2
      },
      {
        bookID: "BOOK007",
        title: "A Clash of Kings",
        author: authors[1]._id,
        publisher: publishers[1]._id,
        edition: "1st Edition",
        price: 15.99,
        availability: true,
        stock: 1
      }
    ];

    const books = [];
    for (const book of bookData) {
      try {
        const newBook = await Book.create(book);
        books.push(newBook);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Book ${book.bookID} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    console.log(`Inserted ${books.length} books`);

    // Insert some book issues (only if we have readers and books)
    let bookIssues = [];
    if (readers.length > 0 && books.length > 0) {
      const bookIssueData = [
        {
          reader_name: readers[0].name,
          book_name: books[0].title,
          readerID: readers[0]._id,
          bookID: books[0]._id,
          status: 'issued',
          issueDate: new Date('2024-01-15'),
          returnDate: null
        }
      ];

      // Add more issues if we have enough readers and books
      if (readers.length > 1 && books.length > 1) {
        bookIssueData.push({
          reader_name: readers[1].name,
          book_name: books[1].title,
          readerID: readers[1]._id,
          bookID: books[1]._id,
          status: 'issued',
          issueDate: new Date('2024-01-20'),
          returnDate: null
        });
      }

      if (readers.length > 2 && books.length > 2) {
        bookIssueData.push({
          reader_name: readers[2].name,
          book_name: books[2].title,
          readerID: readers[2]._id,
          bookID: books[2]._id,
          status: 'returned',
          issueDate: new Date('2024-01-10'),
          returnDate: new Date('2024-01-25')
        });
      }

      if (readers.length > 3 && books.length > 3) {
        bookIssueData.push({
          reader_name: readers[3].name,
          book_name: books[3].title,
          readerID: readers[3]._id,
          bookID: books[3]._id,
          status: 'overdue',
          issueDate: new Date('2024-01-05'),
          returnDate: null
        });
      }

      bookIssues = await BookIssue.insertMany(bookIssueData);
    }
    console.log(`Inserted ${bookIssues.length} book issues`);

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Authors: ${authors.length}`);
    console.log(`- Publishers: ${publishers.length}`);
    console.log(`- Staff: ${staff.length}`);
    console.log(`- Readers: ${readers.length}`);
    console.log(`- Books: ${books.length}`);
    console.log(`- Book Issues: ${bookIssues.length}`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase();
