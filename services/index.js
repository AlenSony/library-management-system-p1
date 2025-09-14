import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();

const port = process.env.PORT || 3000;

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/LibraryManagementSystem";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.use(cors());

app.use(express.json());

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

const Reader = mongoose.model("Reader", ReaderSchema);

const authorSchema = new mongoose.Schema({
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

const Author = mongoose.model("Author", authorSchema);

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

const Book = mongoose.model("Book", BookSchema);

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

const Staff = mongoose.model("Staff", StaffSchema);

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

const Publisher = mongoose.model("Publisher", PublisherSchema);

const Book_Issue_Schema = new mongoose.Schema({
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

const Book_Issue = mongoose.model("Book_Issue", Book_Issue_Schema);

app.post("/api/bookissue", async(req, res) => {
  try{
    const {reader_name, book_name, issueDate} = req.body;

    if (!reader_name || !book_name || !issueDate) {
      return res.status(400).json({message: "Reader name, book name, and issue date are required"});
    }

    const book = await Book.findOne({title: book_name});
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
    
    if (!book.availability || book.stock <= 0) {
      return res.status(400).json({message: "Book is not available"});
    }
    
    const reader = await Reader.findOne({name: reader_name});
    if (!reader) {
      return res.status(404).json({message: "Reader not found"});
    }

    // Calculate return date (7 days from issue date)
    const issueDateObj = new Date(issueDate);
    const returnDateObj = new Date(issueDateObj);
    returnDateObj.setDate(returnDateObj.getDate() + 7);

    const newBookIssue = await Book_Issue.create({
      reader_name,
      book_name,
      readerID: reader._id,
      bookID: book._id,
      status: 'issued',
      issueDate: issueDateObj,
      returnDate: returnDateObj,
    });

    // Update book stock
    await Book.findByIdAndUpdate(book._id, { $inc: { stock: -1 } });
    if (book.stock - 1 <= 0) {
      await Book.findByIdAndUpdate(book._id, { availability: false });
    }

    return res.status(201).json({
      message: "Book issued successfully", 
      bookIssue: newBookIssue,
      returnDate: returnDateObj.toISOString().split('T')[0]
    });
  }
  catch(err){
    console.error("Error issuing book:", err);
    res.status(500).json({message: "Failed to issue book", error: err.message});
  }
});

app.patch("/api/bookissue", async(req,res) => {
  try{
    const {reader_name, book_name} = req.body;
    
    if (!reader_name || !book_name) {
      return res.status(400).json({message: "Reader name and book name are required"});
    }

    const bookIssue = await Book_Issue.findOne({reader_name, book_name, status: 'issued'});
    if (!bookIssue) {
      return res.status(404).json({message: "Active book issue not found"});
    }

    const updatedBookIssue = await Book_Issue.findByIdAndUpdate(
      bookIssue._id, 
      {status: "returned", returnDate: new Date()}, 
      {new: true}
    );

    // Update book stock
    await Book.findByIdAndUpdate(bookIssue.bookID, { $inc: { stock: 1 } });
    await Book.findByIdAndUpdate(bookIssue.bookID, { availability: true });

    return res.status(200).json({message: "Book returned successfully", bookIssue: updatedBookIssue});
  }
  catch(err){
    console.error("Error returning book:", err);
    res.status(500).json({message: "Failed to return book", error: err.message});
  }
});

app.post("/api/author", async(req,res) => {
  try{
    if(!req.body){
      return res.status(400).json({message: "Request body is missing"});
    }
    const {name, email} = req.body;
    if(!name || !email){
      return res.status(400).json({message: "Please fill in all fields"});
    }
    
    const existingAuthor = await Author.findOne({email});
    if(existingAuthor){
      return res.status(400).json({message: "Author with email already exists"});
    }
    
    // Auto-generate authorID based on count
    const authorCount = await Author.countDocuments();
    const authorID = `AUTH${String(authorCount + 1).padStart(3, '0')}`;
    
    const newAuthor = await Author.create({
      authorID,
      name,
      email,
    });
    return res.status(201).json({message: "Author created successfully", author: newAuthor});
  }
  catch(err){
    console.error("Failed to register Author:", err);
    res.status(500).json({message: "Failed to register author", error: err.message});
  }
});

app.get("/api/author", async(req,res) => {
  try{
    const {email} = req.query;
    
    if(!email){
      return res.status(400).json({message: "Email parameter is required"});
    }
    
    const details = await Author.findOne({email});
    if(details){
      return res.status(200).json({
        message: "Author details fetched successfully", 
        author: details
      });
    }
    else{
      return res.status(404).json({
        message: "Author doesn't exist"
      });
    }
  }
  catch(err){
    console.error("Failed to find Author details:", err);
    res.status(500).json({message: "Failed to find author details", error: err.message});
  }
});


app.post("/api/publisher", async(req,res) => {
  try{
    if(!req.body){
      return res.status(400).json({message: "Request body is missing"});
    }
    const {name, yearOfPublication} = req.body;
    if(!name || !yearOfPublication){
      return res.status(400).json({message: "Please fill in all fields"});
    }
    
    const existingPublisher = await Publisher.findOne({name});
    if(existingPublisher){
      return res.status(400).json({message: "Publisher already exists"});
    }
    
    // Auto-generate publisherID based on count
    const publisherCount = await Publisher.countDocuments();
    const publisherID = `PUB${String(publisherCount + 1).padStart(3, '0')}`;
    
    const newPublisher = await Publisher.create({
      publisherID,
      name,
      yearOfPublication,
    });
    return res.status(201).json({message: "Publisher added successfully", publisher: newPublisher});
  }
  catch(err){
    console.error("Failed to register publisher:", err);
    res.status(500).json({message: "Failed to register publisher", error: err.message});
  }
});

app.get("/api/publisher", async(req,res) => {
  try{
    const {name} = req.query;
    
    if(!name){
      return res.status(400).json({message: "Name parameter is required"});
    }
    
    const details = await Publisher.findOne({name});
    if(details){
      return res.status(200).json({
        message: "Publisher details fetched successfully", 
        publisher: details
      });
    }
    else{
      return res.status(404).json({
        message: "Publisher doesn't exist"
      });
    }
  }
  catch(err){
    console.error("Failed to find Publisher details:", err);
    res.status(500).json({message: "Failed to find publisher details", error: err.message});
  }
});

app.post("/api/staff", async(req, res) => {
  try{
    if(!req.body){
      return res.status(400).json({message: "Request body is missing"});
    }
    const {name} = req.body;
    if(!name){
      return res.status(400).json({message: "Please fill in all fields"});
    }
    
    // Auto-generate staffID based on count
    const staffCount = await Staff.countDocuments();
    const staffID = `STAFF${String(staffCount + 1).padStart(3, '0')}`;
    
    const newStaff = await Staff.create({
      staffID,
      name,
    });
    return res.status(201).json({message: "Staff added successfully", staff: newStaff});
  }
  catch(err){
    console.error("Failed to register staff:", err);
    res.status(500).json({message: "Failed to register staff", error: err.message});
  }
});
app.get("/api/staff", async(req, res) => {
  try{
    const {staffID} = req.query;
    
    if(!staffID){
      return res.status(400).json({message: "StaffID parameter is required"});
    }
    
    const details = await Staff.findOne({staffID});
    if(details){
      return res.status(200).json({
        message: "Staff details fetched successfully", 
        staff: details
      });
    }
    else{
      return res.status(404).json({
        message: "Staff doesn't exist"
      });
    }
  }
  catch(err){
    console.error("Failed to find staff details:", err);
    res.status(500).json({message: "Failed to find staff details", error: err.message});
  }
});

app.post("/api/book", async(req, res) => {
  try{
    if(!req.body){
      return res.status(400).json({message: "Request body is missing"});
    }
    const {title, author, publisher, edition, price, stock} = req.body;
    if(!title || !author || !publisher || !edition || !price || stock === undefined){
      return res.status(400).json({message: "Please fill in all required fields"});
    }
    
    const existingBook = await Book.findOne({title});
    if(existingBook){
      return res.status(400).json({message: "Book already exists"});
    }
    
    // Verify author and publisher exist
    const authorExists = await Author.findById(author);
    const publisherExists = await Publisher.findById(publisher);
    
    if(!authorExists){
      return res.status(400).json({message: "Author not found"});
    }
    if(!publisherExists){
      return res.status(400).json({message: "Publisher not found"});
    }
    
    // Auto-generate bookID based on count
    const bookCount = await Book.countDocuments();
    const bookID = `BOOK${String(bookCount + 1).padStart(3, '0')}`;
    
    const newBook = await Book.create({
      bookID,
      title,
      author,
      publisher,
      edition,
      price,
      availability: stock > 0,
      stock,
    });
    return res.status(201).json({message: "Book added successfully", book: newBook});
  }
  catch(err){
    console.error("Failed to register book:", err);
    res.status(500).json({message: "Failed to register book", error: err.message});
  }
});

app.get("/api/book", async(req, res) => {
  try{
    const {title} = req.query;
    
    if(!title){
      return res.status(400).json({message: "Title parameter is required"});
    }
    
    const details = await Book.findOne({title}).populate('author').populate('publisher');
    if(details){
      if(!details.availability){
        return res.status(400).json({message: "Book is not available"});
      }
      return res.status(200).json({
        message: "Book details fetched successfully", 
        book: details
      });
    }
    else{
      return res.status(404).json({
        message: "Book doesn't exist"
      });
    }
  }
  catch(err){
    console.error("Failed to find book details:", err);
    res.status(500).json({message: "Failed to find book details", error: err.message});
  }
});

// Additional endpoints for better functionality

// Get all books
app.get("/api/books", async(req, res) => {
  try{
    const books = await Book.find().populate('author').populate('publisher');
    return res.status(200).json({
      message: "Books fetched successfully", 
      books: books
    });
  }
  catch(err){
    console.error("Failed to fetch books:", err);
    res.status(500).json({message: "Failed to fetch books", error: err.message});
  }
});

// Get all authors
app.get("/api/authors", async(req, res) => {
  try{
    const authors = await Author.find();
    return res.status(200).json({
      message: "Authors fetched successfully", 
      authors: authors
    });
  }
  catch(err){
    console.error("Failed to fetch authors:", err);
    res.status(500).json({message: "Failed to fetch authors", error: err.message});
  }
});

// Get all publishers
app.get("/api/publishers", async(req, res) => {
  try{
    const publishers = await Publisher.find();
    return res.status(200).json({
      message: "Publishers fetched successfully", 
      publishers: publishers
    });
  }
  catch(err){
    console.error("Failed to fetch publishers:", err);
    res.status(500).json({message: "Failed to fetch publishers", error: err.message});
  }
});

// Get all staff
app.get("/api/staffs", async(req, res) => {
  try{
    const staffs = await Staff.find();
    return res.status(200).json({
      message: "Staff fetched successfully", 
      staffs: staffs
    });
  }
  catch(err){
    console.error("Failed to fetch staff:", err);
    res.status(500).json({message: "Failed to fetch staff", error: err.message});
  }
});

// Get all book issues
app.get("/api/bookissues", async(req, res) => {
  try{
    const bookIssues = await Book_Issue.find().populate('readerID').populate('bookID');
    return res.status(200).json({
      message: "Book issues fetched successfully", 
      bookIssues: bookIssues
    });
  }
  catch(err){
    console.error("Failed to fetch book issues:", err);
    res.status(500).json({message: "Failed to fetch book issues", error: err.message});
  }
});

// Reader registration endpoint
app.post("/api/reader", async(req, res) => {
  try{
    if(!req.body){
      return res.status(400).json({message: "Request body is missing"});
    }
    const {name, email, phone, password, address} = req.body;
    if(!name || !email || !phone || !password || !address){
      return res.status(400).json({message: "Please fill in all fields"});
    }
    
    const existingReader = await Reader.findOne({$or: [{email}, {phone}]});
    if(existingReader){
      return res.status(400).json({message: "Reader with email or phone already exists"});
    }
    
    // Auto-generate readerID based on count
    const readerCount = await Reader.countDocuments();
    const readerID = `READER${String(readerCount + 1).padStart(3, '0')}`;
    
    const newReader = await Reader.create({
      readerID,
      name,
      email,
      phone,
      password,
      address,
    });
    return res.status(201).json({message: "Reader registered successfully", reader: newReader});
  }
  catch(err){
    console.error("Failed to register reader:", err);
    res.status(500).json({message: "Failed to register reader", error: err.message});
  }
});

// Get reader details
app.get("/api/reader", async(req, res) => {
  try{
    const {email} = req.query;
    
    if(!email){
      return res.status(400).json({message: "Email parameter is required"});
    }
    
    const details = await Reader.findOne({email}).populate('books');
    if(details){
      return res.status(200).json({
        message: "Reader details fetched successfully", 
        reader: details
      });
    }
    else{
      return res.status(404).json({
        message: "Reader doesn't exist"
      });
    }
  }
  catch(err){
    console.error("Failed to find reader details:", err);
    res.status(500).json({message: "Failed to find reader details", error: err.message});
  }
});

// Get all readers
app.get("/api/readers", async(req, res) => {
  try{
    const readers = await Reader.find().select('readerID name email phone address');
    return res.status(200).json({
      message: "Readers fetched successfully", 
      readers: readers
    });
  }
  catch(err){
    console.error("Failed to fetch readers:", err);
    res.status(500).json({message: "Failed to fetch readers", error: err.message});
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    status: "healthy"
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
